import styled from '@emotion/styled';
import { Pagination } from 'antd';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '../components/layout';
import PostCard from '../components/post-card';
import { flexCenter } from '../components/_shared/styled-mixins';
import { StyledFullHeightSection } from '../components/_shared/styled-section';

const StyledPaginationContainer = styled.div`
  ${flexCenter};
  width: 100%;
  margin-top: 2.5rem;

  & ul.ant-pagination {
    cursor: pointer;
    display: flex;
    list-style: none;

    & > li {
      ${flexCenter};
      min-width: 1rem;
    }
    & > li.ant-pagination-item {
      font-size: 1.5rem;
    }
    & > li.ant-pagination-disabled > a {
      color: var(--disabled-color);
    }
  }
`;
const Blog = ({ data }) => {
  let [currentPage, setCurrentPage] = React.useState(1);

  const onPaginationChange = page => {
    setCurrentPage(page);
  };

  let paginationSize = data.site.siteMetadata.paginationPageSize;
  let leftCursor = (currentPage - 1) * paginationSize;
  let rightCursor = leftCursor + paginationSize;

  return (
    <Layout>
      <StyledFullHeightSection>
        <StyledPaginationContainer>
          <Pagination
            pageSize={paginationSize}
            current={currentPage}
            onChange={onPaginationChange}
            total={data.allMarkdownRemark.edges.length}
          />
        </StyledPaginationContainer>
        {data.allMarkdownRemark.edges.slice(leftCursor, rightCursor).map(({ node }) => {
          const coverImage = node.frontmatter.cover_image ? node.frontmatter.cover_image.childImageSharp.fluid : null;
          return node.frontmatter.published ? (
            <PostCard
              key={node.frontmatter.title}
              coverImage={coverImage}
              title={node.frontmatter.title}
              date={node.frontmatter.date}
              description={node.frontmatter.description}
              link={`/blog${node.fields.slug}`}
              tags={node.frontmatter.tags}
            />
          ) : null;
        })}
      </StyledFullHeightSection>
    </Layout>
  );
};

Blog.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Blog;

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      filter: { fileAbsolutePath: { regex: "/content/posts/" }, frontmatter: { published: { ne: false } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            tags
            date(formatString: "D MMMM, YYYY")
            published
            description
            cover_image {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
    site {
      siteMetadata {
        paginationPageSize
      }
    }
  }
`;
